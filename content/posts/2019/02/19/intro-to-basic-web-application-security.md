---
meta:
  description: Intro to basic web application security for beginners
  tags: php, backend, security
postImage: /assets/posts/2019/security.jpg
postTitle: "Intro to basic web application security"
publishDate: "2019-02-19"
teaserText: >
  <p class="py-2">PHP has some great advantages over several other languages in that it's really easy for beginners to set-up a basic
  website. That upside comes with some downsides too. A lot of basic PHP tutorials fail to cover important aspects of
  application security.</p>
  <p class="py-2">This post is divided into several sections each covering a different security threat and how to properly defend your
  site against it.</p>
tags:
  - php
  - backend
  - security
---

PHP has some great advantages over several other languages in that it's really easy for beginners to set-up a basic
website. That upside comes with some downsides too. A lot of basic PHP tutorials fail to cover important aspects of
application security.

This post is divided into several sections each covering a different security threat and how to properly defend your
site against it. Please note that this list is in no way a complete guarantee that nothing bad will ever happen to your
site. You should still do research on your own and read articles and books about application security.

Also please note that example code is written as concise and easy to understand as possible and might not follow best
practices for that reason. A lot of the code will often be abstracted away by frameworks and libraries in the real
world. As a back-end developer you are not only tasked with storing and processing user-data you also need to know how
to secure it properly.

* [SQL Injection](#sqli)
* [XSS](#xss)
* [XSRF/CSRF](#xsrf)
* [LFI](#lfi)
* [Insufficient password hashing](#passwords)
* [MITM](#mitm)
* [Command injection](#command-injection)
* [XXE](#xxe)
* [Sensitive data exposure](#exceptions)
* [Rate limiting](#rate-limiting)
* [Other more obvious stuff](#misc)

<h2 id="sqli">SQL Injection</h2>

Bet you saw that one coming. This is one of the biggest threats to your site. Having a site vulnerable to SQL injection
can mean that anybody can dump your database, or do even worse stuff.

So what does this even mean? If your application fetches dynamic content from a database that means you'll have to
execute some kind of SQL. Let's take a simple example like this:

```php
<?php

$username = $_GET['username'];
$query = "SELECT * FROM users WHERE username = '$username'";
```

The attacker controls the queries sent via GET and POST (and some other ones like UA). Usually you'd expect a normal
username like 'peter' resulting in a query that looks like this:

```sql
SELECT * FROM users WHERE username = 'peter'
```

However since the attacker controls what he sends he can modify the username parameter to look more like: ' OR '1'='1  
This would result in a query that looks like this:

```sql
SELECT * FROM users WHERE username = 'peter' OR '1' = '1'
```

And just like that he dumped like your entire user table and is running away with all your passwords.

So how do we protect against this? There are two main ways of doing it. Escaping user input or using prepared
statements. When you're escaping user input you're wrapping every piece of user supplied information with a function
that strips harmful tags. I'm not a very big fan of that solution since you can easily forget to apply it to every part
of your application.

So here is how to do a prepared statement with PDO (mysqli also supports prepared statements):

```php
$username = $_GET['username'];
$query = $pdo->prepare('SELECT * FROM users WHERE username = :username');
$query->execute(['username' => $username]);
$data = $query->fetch();
```

Every part of dynamic data is prefixed with a colon. Afterwards you pass all parameters as an array to the execute
function and just like that PDO escaped all harmful data for you.

Prepared statements are supported by pretty much all database drivers, there is no excuse for not using them! Get in the
habit of writing all your queries this way so you won't accidentally forget afterwards.

Also check out this helpful article from phpdelusions that deals with security issues when you're dynamically building
your SQL
queries: [https://phpdelusions.net/pdo/sql\_injection\_example](https://phpdelusions.net/pdo/sql_injection_example)

<h2 id="xss">XSS</h2>

XSS stands for cross site scripting; an attacker injects JavaScript into your site. There are two main variants of XSS,
stored and reflected. Reflected XSS means the malicious script is passed through a GET parameter in the URL, stored
means the script is stored in some way on your server.

XSS can happen when you improperly escape user input that is rendered into an HTML page. Take for example this simple
search page that prints what the user searched for (reflected XSS):

```php
<body>
<?php
$searchQuery = $_GET['q'];
/* some search magic here */
?>
<h1>You searched for: <?php echo $searchQuery; ?></h1>
<p>We found: Absolutely nothing because this is a demo</p>
</body>
```

Since you render what the user sent directly into your page an attacker can construct a URL that looks like this:

```html
search.php?q=%3Cscript%3Ealert(1)%3B%3C%2Fscript%3E
```

The resulting document would now look like this (popping an alert box):

```html

<body>
<h1>You searched for:
    <script>alert(1);</script>
</h1>
<p>We found: Absolutely nothing because this is a demo</p>
</body>
```

So why should you care?

Javascript can:

* Load exploit kits infecting your users with malware
* Steal improperly configured cookies
* Steal login credentials by hooking a key-logger on your login forms
* Steal confidential information
* Perform pretty much any action a user on your site could
* Deface your website and replace all your images with Nicolas Cage
* ...

So how do we protect ourselves from that?

The good news is that some modern browsers already take steps to block those kinds of attacks from happening by matching
url parameters to rendered JavaScript. However this is only a very weak defense and you should NOT rely on it.

The proper way to defend yourself is by escaping user inputs. Either manually like this:

```php
<?php

$searchQuery = htmlentities($searchQuery, ENT_QUOTES);
```

Or (what I would recommend) using a templating Engine like [Twig](https://twig.symfony.com/) that escapes all rendered
strings by default.

Please note that if you're storing anything a user provided you, you also absolutely must escape this data since an
attack like the following would easily be possible otherwise. We assume you gave the user the ability to add their
homepage in their profile and now you're trying to render it:

```php
<body>
  <a href="<?php echo $homepageUrl; ?>">Visit Users homepage</a>
</body>
```

The vulnerability here isn't immediately obvious and I've seen this exact error multiple times over the last couple of
years. The user doesn't even have to construct a script tag to execute JavaScript here.

All he needs to do is pass the following string to you:

```html
#" onclick="alert(1)
```

The missing quote will be provided by you resulting in:

```html

<body>
<a href="#" onclick="alert(1)">Visit Users homepage</a>
</body>
```

Always, always always assume user supplied content is hostile and will try to harm you and or break your system. There
are multiple good guides online on what further measures you can take to filter your content. It's vital to do some
research in this area!

Another way you can harden your site against XSS attacks is by providing a CSP meta tag or header. Mike West has an
excellent tutorial on how to use them that you should absolutely check
out: [https://www.html5rocks.com/en/tutorials/security/content-security-policy/](https://www.html5rocks.com/en/tutorials/security/content-security-policy/)

You should also mark all cookies that you're only using in PHP as "HTTP ONLY". This prevents JavaScript on your site
from reading cookies you sent to the browser. This is a flag you should always set if possible since also scripts you
knowingly embedded in your page (like Advertisements) can read your cookies and steal information.

<h2 id="xsrf">XSRF/CSRF</h2>

CSRF short for Cross-Site Request Forgery is a technique attackers use to trick your users into executing unwanted
actions in your application while being logged into your system.

Please note that while the example I'll be showing you relies on a GET request to make it easier to understand using
POST is NOT a protection. Neither are secret cookies or multi step forms.

Let's say you have a page that let's users delete their account like this:

```php
<?php
//delete-account.php

$confirm = $_GET['confirm'];

if($confirm === 'yes') {
  //goodbye
}
```

An attacker can construct a form on his site that triggers this special URL (this also works with forms that use POST),
or even easier in this case trick your browser into loading the URL with something like an image tag:

```html
<img src="https://example.com/delete-account.php?confirm=yes"/>
```

And just like that in the blink of an eye your user account is gone.

Defending against attacks like this is a bit more complicated than defending against XSS or SQLi.

The most popular way of defending against this is generating a large cryptographically secure string called an CSRF
token and storing that in a cookie or the users session.

Whenever you are building a form on your site, you render the token into a hidden form field that you validate against
the token that is stored in the users session once you receive the form.

Since an attacker cannot know this token (it's random per session), there is no way he can impersonate a user.

```php
<?php /* the page your form is embedded in */ ?>

<form action="/delete-account.php" method="post">
  <input type="hidden" name="csrf" value="<?php echo $_SESSION['csrf']; ?>">
  <input type="hidden" name="confirm" value="yes" />
  <input type="submit" value="Delete my account" />
</form>

-----

<?php
//delete-account.php

$confirm = $_POST['confirm'];
$csrf = $_POST['csrf'];
$knownGoodToken = $_SESSION['csrf'];

if($csrf !== $knownGoodToken) {
  die('Invalid request');
}

if($confirm === 'yes') {
  //goodbye
}
```

Please note that this is a very simple example and there's much more you can do. If you're using a PHP framework like
Symfony there is already a CSRF token provided for you that you can use.

Also check out OWASP's cheatsheet on the issue that goes into much more detail and even more defense
mechanisms: [https://github.com/OWASP/CheatS....](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)

<h2 id="lfi">LFI</h2>

LFI (Local file inclusion) is a vulnerability that can happen when you take unverified user input that results in you
reading a file from disk.

The usual examples I see for this in the real world are poorly programmed routing files that don't verify and sanitize
user input. Let's take this file as an example that takes the template file it should load as a GET parameter:

```php
<body>
<?php
  $page = $_GET['page'];
  if(!$page) {
    $page = 'main.php';
  }
  include($page);
?>
</body>
```

Since include can load any file and not only PHP files an attacker can pass any file on your file-system as an inclusion
target.

```html
index.php?page=../../etc/passwd
```

This would result in the file /etc/passwd to be read and dumped to the browser.

To defend against this attack you have to make careful considerations on what type of user input you want to allow and
strip potentially harmful characters like "." "/" "\\" from the input string.

If you really want to use a routing system like this (which I wouldn't recommend in any way), you could automatically
append the php extension yourself, strip any characters that are not [a-zA-Z0-9\-\_] and load the templates from a
dedicated templates folder to avoid inclusion of anything that isn't a template file.

I've seen this vulnerability multiple times in production PHP code in different contexts. Always set clear outlines from
the start what a valid file is allowed to look like and strip anything that doesn't fit your pattern. You can also build
the absolute path to the file you'd like to read and verify that it's inside your project directory and not anywhere
else as an additional protection.

<h2 id="passwords">Insufficient password hashing</h2>

Almost all web applications will have to store user passwords at some point in their life. Knowing how to properly
secure those passwords is crucial and can buy your users precious days or even months after you have been hacked.

The worst possible thing you can do is store your users passwords in plain text. Many users re-use passwords across
sites (even though they absolutely shouldn't), and if you get hacked it could mean that a lot of their other accounts
end up compromised as well.

You should also avoid using hashing algorithms that were not explicitly designed for passwords. Hashing algorithms like
MD5 and SHA were designed to be very fast. This is not what you want when storing passwords. The end goal is that the
attackers have to spend as much time and ultimately money cracking your hashed passwords as possible.

Another important thing is that you should not only store the password but also a randomly generated string (usually
called salt) with your password. This salt string is added to the password during hashing to avoid that two identical
passwords in your database end up with the same hash.

The following example is using MD5 because the hash is nice and short, please DO NOT EVER store passwords with MD5. MD5
is broken, insecure and way too fast.

Let's say user1 has the super secure password of "ilovecats123", user315 has the same password. This results in both
users having this hash in their database row: 5e2b4d823db9d044ecd5e084b6d33ea5

If a hacker is now cracking easily guessable passwords and you haven't salted your passwords he can skip trying to
bruteforce the password of user315 because user1 has the same hash as him. We want them to spend as much money as
possible cracking our passwords so we add a randomly generated salt to it.

```php
<?php
//warning: !!do not use, insecure code sample!!

$password = 'cat123';
$salt = random_bytes(20);

$hash = md5($password . $salt);
```

And just like that all of your stored passwords are unique. Don't forget to save your salt otherwise this will not work.

At the moment one of the best options for hashing passwords is bcrypt. It's designed for passwords and has a
configurable work factor built in, meaning you can decide how hard the attacker has to work for hashing 1 password.

Fortunately for you new versions of PHP come with a function
called [password_hash](https://secure.php.net/password_hash) that does all the hard work for you. You don't even need to
generate a salt, the function does it for you! It also comes with a function called
[password_verify](https://secure.php.net/password_verify) that can check if a user password is valid. password_verify is
also safe against [timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

Here is an example how to use them:

```php
<?php

//user signup
$password = $_POST['password'];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

//login
$password = $_POST['password'];
$hash = '1234'; //load this value from your db

if(password_verify($password, $hash)) {
  echo 'Password is valid!';
} else {
  echo 'Invalid password.';
}
```

Also please note that hashing is not the same thing as encryption. If you hash something you loose information and the
data behind the hash can never be recovered except with a brute force attack. This is what we want when storing
passwords. Encryption on the other hand saves the original information in a "scrambled" format and the information can
be recovered if you know the encryption key.

I've seen a lot of people mixing those two concepts up so I thought I'd clarify some of the key differences between
them.

<h2 id="mitm">MITM</h2>

A MITM (man in the middle) attack is no direct attack against your system but an attack directed against your users. A
bad actor intercepts the traffic between your website and the user and injects malicious content or reads confidential
information. This usually happens at public WiFi networks though it can also happen anywhere else traffic passes through
like at the user's ISP.

The one and only defense against this is to use HTTPS. With HTTPS your connection will be encrypted and traffic cannot
be read or tampered with. You can get a free SSL certificate from [Let's Encrypt](https://letsencrypt.org/) or purchase
one from a large number of other providers. I will not go into detail on how you can configure your web-server correctly
since this is not related to application security and highly depends on your configuration.

However there are a number of things you can do to make HTTPS even safer. The first thing you can do is to send a
[Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) header.
This header tells the browser that your website will always be served over HTTPS, if your website is not served over
HTTPS something went seriously wrong and the browser shouldn't display the page.

However there is one obvious problem with this. If your browser has never seen your website before it can't know that
you want this header to be applicable. This is where hstspreload comes into play.

You can register your site here: https://hstspreload.org/

All sites you submit there will be marked as HTTPS only and will be hardcoded into the source-code of Google Chrome,
Firefox, Opera, Safari, IE11 and Edge.

You can also add
a [Certification Authority Authorization (CAA) record](https://support.dnsimple.com/articles/caa-record/) in your DNS
configuration to only allow one certificate authority (for example Let's encrypt) to issue certificates for your domain.
This further increases security for your users.

<h2 id="command-injection">Command injection</h2>

This is probably the worst attack your server can experience. The goal of command injection is to trick your server to
execute arbitrary shell commands.

You will run into this attack if you use the [shell_exec](https://secure.php.net/manual/en/function.shell-exec.php) or
exec function. Let's make a small example that allows the user to ping a different host from your server for the sake of
simplicity.

```php
<?php

$targetIp = $_GET['ip'];
$output = shell_exec("ping -c 5 $targetIp");
```

The output will contain 5 ping attempts to the target host. Unless the user decides to take advantage of SH's command
chaining capability, then he can execute whatever he want:

```html
ping.php?ip=8.8.8.8;ls -l /etc
```

SH will execute both the ping and the second command chained by the attacker. This is obviously very very bad.

Thankfully php offers a function to escape shell
parameters. [escapeshellarg](https://secure.php.net/manual/en/function.escapeshellarg.php) escapes user input and wraps
it into single quotes.

Now your command should be reasonably safe. Personally I'd still avoid calling external commands with PHP but that's up
to your taste. Also I'd recommend further validating that user input matches a pattern that you expect.

<h2 id="xxe">XXE</h2>

XXE (XML external entity) is an attack that can lead to a LFI attack or even remote code execution when your application
parses XML with a badly configured XML parser.

A little known feature of XML allows document authors to include remote and local files as entities in their XML files.

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE foo [
        <!ELEMENT foo ANY >
        <!ENTITY passwd SYSTEM "file:///etc/passwd" >]>
<foo>&passwd;</foo>
```

And just like that the contents of /etc/passwd has been dumped into the XML file.

If you're using libxml you can
call [libxml\_disable\_entity\_loader](https://secure.php.net/manual/en/function.libxml-disable-entity-loader.php) to
protect yourself against this kind of attack. Always double check the default configuration of your XML library and make
sure this setting is set.

<h2 id="exceptions">Sensitive data exposure through improper error reporting in production</h2>

If you are not careful you might leak sensitive information like folder structures, db structures, connection
information and user information through improper error handling in production environments.

<img quality="90" alt="Yii database exception" src="/assets/posts/2019/db-exception.jpg" width="1253" height="1007" />

You wouldn't want your users to see that right?

The approach of configuring your application changes widely based on the framework or CMS you use. Usually your
framework has a setting that allows you to change your site into a production environment of some sort. This usually
swallows all user visible error messages and redirects them into a log-file showing the user a non-descript 500 error
while allowing you to examine the errors.

But there are also settings in PHP you should set according to your
environment: [error_reporting](https://secure.php.net/manual/en/function.error-reporting.php)
and [display_errors](https://secure.php.net/manual/en/errorfunc.configuration.php#ini.display-errors).

<h2 id="rate-limiting">Rate limiting login</h2>

Sensitive forms like your login form should have a strict rate-limit applied to it to prevent brute force attacks. Save
how many failed login attempts each user had in the last couple of minutes. If that rate exceeds your defined threshold
deny further login attempts until a cool-down period expires. Also inform the user about failed logins via E-Mail so
they know they're being targeted.

<h2 id="misc">Other more obvious stuff</h2>

* Don't trust IDs of objects passed to you from a user. Always verify that the user had access rights to the requested
  objects.
* Always keep your Server and used libraries up to date
* Subscribe to blogs that focus on security to stay up to date on best practices
* Never save user passwords in your logs
* Don't store your entire code-base in your webroot
* NEVER check out a git repository in your webroot unless you want your entire code-base leaked.
* Always assume user input is malformed and tries to harm you
* Set-up systems to ban IP addresses that display suspicious behaviors, like scanning random URLs faster than a human
  could
* Don't assume 3rd party code is safe, it's probably not
* Don't pull code directly from GitHub with composer
* Set anti framing headers if you don't want your site to be framed on 3rd party domains
* Obscurity is not security.
* If you work with contractors or developers with little practical experience, make sure you do frequent code-reviews if
  possible
* When you don't understand how a security feature is supposed to work or why it's in place ask someone that knows.
  Don't just ignore it
* Never write your own encryption. It's probably a bad idea
* Properly seed your PRNGs and fail if you don't have enough entropy
* If it's on the internet it's not secure and will be stolen at some point in the future. Prepare for that scenario and
  have an incident response plan at hand
* Disable directory listings for your web-root. Many web-servers are configured to list directory contents by default.
  This can lead to data leaks.
* Client side validation is not enough, validate everything in PHP again
* Avoid deserialization of user content at all costs. This can and will lead to remote code execution. See this article
  for more details on this
  issue: [https://paragonie.com/blog/2016/04/securely-implementing-de-serialization-in-php](https://paragonie.com/blog/2016/04/securely-implementing-de-serialization-in-php)

## Takeaways

I'm in no way a security expert so take everything with a grain of salt. Writing secure software is a painful difficult
process but if you follow some basic rules you can write reasonably secure applications. Using a framework can help you
do much of the heavy lifting in that regard.

Security is not something that can be tacked onto your code-base after the fact. You should always have security in mind
when writing your code. If you're pressured by management to skip some steps to work faster and "secure it later on"
make sure they understand the implications it can have.

If this post helped you in any way please share it with your friends and help the web become a tiny bit more secure.
