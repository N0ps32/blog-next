---
meta:
    description: How to allow Twig template code to be inserted in Craft CMS content entries
    tags: twig, craft cms, php, twig filter, twig insert html
postImage: 2019/twig_craft-1.jpg
postTitle: "Allow Craft CMS editors to insert Twig in CMS entries"
publishDate: "2019-02-03"
teaserText: >
    Sometimes there are unique content requirements that require content editors to insert Twig code in Craft CMS entries.
    However this raises several security concerns and issues. In this post I'll highlight the solution I developed for my
    blog.
tags:
    - craft-cms
    - php
    - backend
    - twig
---

Sometimes there are unique content requirements that require content editors to insert Twig code in Craft CMS entries.
However this raises several security concerns and issues. In this post I'll highlight the solution I developed for my blog.

We could just create a new field, take the raw output and throw it into the "template_from_string" Twig function.
However doing that allows the execution of dangerous Twig functions.
So we need to restrict what functions and filters are allowed to be used when inserting content from the CMS.

Luckily for us Twig provides something called "sandbox" mode that allows us to do just that.
First you need to configure Craft to load your module if you haven't already.
It should be enough to add " 'bootstrap' => ['my-module'], " to "config/app.php".
If you have a default installation this line should already be present but commented out.

After that add the following code to "modules/Module.php":

```php
if (Craft::$app->getRequest()->getIsSiteRequest()) {
    Sandbox::addTwigSandbox();
}
```

Now create a new php file called "Sandbox.php" in the modules folder. This is where our Twig sandbox configuration
will go. You will be able to configure what you deem to be safe for your site individually.

```php
<?php

namespace modules;

use Craft;
use Twig_Extension_Sandbox;

class Sandbox
{

    private static $allowedTags = [];

    private static $allowedFilters = [];

    private static $allowedFunctions = [];

    private static $allowedMethods = [];

    private static $allowedProperties = [];

    public static function addTwigSandbox()
    {
        Craft::$app
            ->getView()
            ->registerTwigExtension(
                new Twig_Extension_Sandbox(self::buildPolicy())
            );
    }

    private static function buildPolicy(): \Twig_Sandbox_SecurityPolicyInterface
    {
        return new \Twig_Sandbox_SecurityPolicy(
            self::$allowedTags,
            self::$allowedFilters,
            self::$allowedMethods,
            self::$allowedProperties,
            self::$allowedFunctions
        );
    }

}
```

The sandbox is now up and running. You can now configure what filters, functions, methods and properties should be
considered safe in the static arrays. You can find the full list of filters and functions here:
[https://twig.symfony.com/doc/2...](https://twig.symfony.com/doc/2.x/)

This is the configuration I use for my blog but YMMV so consider reading through the Twig documentation and deciding for yourself:

```php
private static $allowedTags = [
    'autoescape',
    'filter',
    'do',
    'flush',
    'for',
    'set',
    'verbatim',
    'if',
    'spaceless',
];

private static $allowedFilters = [
    'abs',
    'batch',
    'capitalize',
    'convert_encoding',
    'date',
    'date_modify',
    'default',
    'escape',
    'first',
    'format',
    'join',
    'json_encode',
    'keys',
    'last',
    'length',
    'lower',
    'merge',
    'nl2br',
    'number_format',
    'raw',
    'replace',
    'reverse',
    'round',
    'slice',
    'sort',
    'split',
    'striptags',
    'title',
    'trim',
    'upper',
    'url_encode',
];

private static $allowedFunctions = [
    'attribute',
    'cycle',
    'date',
    'dump',
    'max',
    'min',
    'random',
    'range',
];

private static $allowedMethods = [];

private static $allowedProperties = [];
```

Now we need to render it in a template. To do this simply create a new field that will output plain text.
I recommend installing the Code Mirror plugin so you have a better way of inserting this content in the CMS but that's of course up to you.

After creating out field we can render it like this (I called the field I created "twig" in this example):

```twig
{% set tpl = template_from_string(yourEntry.twig) %}
{{ include(tpl, sandboxed = true) }}
```

After that the Twig content you insert in the CMS should be displayed on your page.