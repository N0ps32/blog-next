---
meta:
    description: Practical implementation of HTTP/2 Server Push with PHP and Twig
    tags: twig, php, caddy, http2, server push, preload
postImage: 2019/programming_header.jpg
postTitle: "Practical PHP/Twig implementation for HTTP/2 Server Push"
publishDate: "2019-02-01"
teaserText: >
    HTTP/2 offers many advantages over legacy protocols like HTTP/1.1. One of those features is Server Push,
    a way to push assets to the client before the server supplies the requested HTML document.
    This allows for faster load-times for critical assets. In this example I will be using the Caddy webserver,
    however modern Apache 2 and nginx versions also support Sever Push and HTTP/2.
tags:
    - caddy
    - php
    - backend
    - http2
---

HTTP/2 offers many advantages over legacy protocols like HTTP/1.1. One of those features is Server Push, a way to push
assets to the client before the server supplies the requested HTML document. This allows for faster load-times for
critical assets. In this example I will be using the Caddy webserver, however modern Apache 2 and nginx versions also
support Sever Push and HTTP/2.

One way to do this is to hardcode assets that should be pushed into the web-servers configuration file like this:

```text
push / {
    /resources/css/blogs
    /resources/js/main.js
    /resources/js/jquery.min.js
    /resources/images/logo.png
}
```

This has one obvious problem. Every-time you want to change the pushed assets you have to reload the web-server to
reload the configuration. However there's another way to solve this. Most servers support pushing assets using the
["Link" HTTP header](https://w3c.github.io/preload/#server-push-http-2). The header must be structured as follows:

```text
</assets/css/blog.css>; rel=preload; as=style
```

Additional assets must be appended using a colon. Once Caddy sees this header it will push the specified assets to the
client. It's also possible to push assets hosted on different domains, however this article will focus on locally hosted
assets.

The first thing we'll do is set-up a twig filter that we can pipe asset URLs into. We'll collect those URLs and once our
template is rendered we'll send the Link header made up of our asset URLs.

```php
<?php

namespace modules;

use \RuntimeException;

class H2PushHelper extends \Twig_Extension
{

    public static $assetsToPush = [];

    // https://fetch.spec.whatwg.org/#concept-request-destination
    private static $autoDetectTypes = [
        "/\.js(\?.*)?$/i" => 'script',
        "/\.css(\?.*)?$/i" => 'style',
        "/\.(jpe?g|png|gif|apng|tiff|bmp|webp|ico)(\?.*)?$/i" => 'image',
    ];

    public function h2Push(string $input, $type = null, $crossorigin = false): string
    {
        if (!empty(self::$assetsToPush[$input])) {
            return $input;
        }

        //no type specified
        if ($type === null) {
            foreach (self::$autoDetectTypes as $regex => $pushType) {
                if (preg_match($regex, $input)) {
                    $type = $pushType;
                    break;
                }
            }
        }

        //no type specified and auto detect failed
        if ($type === null) {
            throw new RuntimeException("Could not detect h2 push type for asset $input, please specify in filter.");
        }

        self::$assetsToPush[$input] = [
            'type' => $type,
            'crossorigin' => $crossorigin,
        ];

        //pass back input to template
        return $input;
    }

    public function getFilters(): array
    {
        return [
            new \Twig_Filter('h2push', [$this, 'h2Push']),
        ];
    }

}
```

This filter allows us to specify assets we'd like to push like so:

```twig
<link rel="stylesheet" href="{{ '/assets/css/blog.css' | h2push }}">
```

All file paths will be stored in the $assetsToPush array. Since the header requires us to specify what type of asset
we're pushing js, css and image files will be detected automagically so we don't have to specify the type by hand.

You can find a full list of supported file types in the specification of the push
feature: [https://fetch.spec.whatwg.org/...](https://fetch.spec.whatwg.org/#concept-request-destination)

After we rendered our template we need to build the header and send it to the client.

```php
$assets = [];

//iterate over assets to build Link substrings
foreach (H2PushHelper::$assetsToPush as $asset => $config) {
    $type = $config['type'];
    if ($config['crossorigin']) {
        $assets[] = "<$asset>; rel=preload; as=$type; crossorigin";
    } else {
        $assets[] = "<$asset>; rel=preload; as=$type";
    }
}

if (count($assets) < 1) {
    return;
}

$header = implode(',', $assets);
header("Link: $header");
```

Another way to improve this solution is to cache the header after the first request and send it before you render your
template if your framework allows that.

Now all that's left to do is change our Caddyfile to activate Server Push:

```text
yoursite.com {
    push
}
```

That's it! Now you can push any asset you want without the need to reload your server every-time you want to change
something. An important note to add is that Server Push does not automatically make all sites faster and you should
consider what you actually push to your clients carefully.

Also the feature has been known to still be a bit buggy at times so test your changes carefully unless you want a nasty
surprise later. Here you can find an excellent blog post outlining the advantages and problems with Server
Push: [https://jakearchibald.com/2017...](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/)
