---
meta:
    description: "I launched my new blog, built with Caddy, Craft CMS and Debian 9"
    tags: blog, caddy, craft cms
postImage: /assets/posts/2019/CWYK8CLC61.jpg
postTitle: "New year, new blog"
publishDate: "2019-01-30"
teaserText: >
    <p class="py-2">With a new year comes a new server (now Debian 9 wooo!) and a new blog system built on craft 3.</p>
    <p class="py-2">Right of the bat I faced multiple challenges deploying this new blog because of a wonderful bug that causes the locking
    of project.yaml to not work in production environments. Long story short I had to reinstall this blog four times before
    it actually working.</p>
    <p class="py-2">The blog is served by Caddy which is awesome! It provides HTTPS with Let's Encrypt and HTTP2 with 
    zero configuration. Here is what my setup looks like:</p>
tags:
    - blog-update
    - caddy
    - craft-cms
---

With a new year comes a new server (now Debian 9!) and a new blog system built on craft 3.

Right of the bat I faced multiple challenges deploying this new blog because of a wonderful bug that causes the locking
of project.yaml to not work in production environments. Long story short I had to reinstall this blog four times before
it actually working.

The blog is served by Caddy which is awesome! It provides HTTPS with Let's Encrypt and HTTP2 with zero configuration.
Here is what my setup looks like:

```text
raeder.technology {
    tls blog@raeder.technology
    redir https://www.raeder.technology{uri}
}

www.raeder.technology {
    tls blog@raeder.technology
    root /var/www/blog/blog/web
    gzip
    header /assets Cache-Control "public, max-age=31536000"
    header /favicon.ico Cache-Control "public, max-age=31536000"
    header /uploads Cache-Control "public, max-age=31536000"
    header / Strict-Transport-Security "max-age=31536000;"
    fastcgi / 127.0.0.1:9000 php {
        index index.php
    }
    rewrite {
        to {path} {path}/ /index.php?p={path}&{query} /index.php?{query}
    }
}
```

Easy right?

And what's even better, everything is hosted on this server. Zero outgoing requests to companies that might like to
collect personal information on you.
