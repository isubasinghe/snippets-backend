# What is this project

Its an insecure FaaS essentially, you can host your random snippets of code on here.  
Just make sure that it isnt security critical code.  
I have some security going on however, I have only allowed the http and net modules on here. Please let me know if other modules are required, I can write mock interfaces for fs if needed.

## Creating a function

Submit a POST request to http(s)://host/api/create that follows the JSON spec below

```javascript
{
    "source" "This is where a string representation of your source code should go, this source code MUST contain a module.exports to a fucntion that has two parameters, req: the express js request object and cb: the callback to return after execution of code."
}
```
Here is an example
```javascript
{
	"source": "module.exports = function(req, callback) { callback({data: 'hello' }); }"
}
```
This will return a json in this format
```javascript
{
  "message": "Created function {sha256_hash_of_source_code_after_beautify}"
}
```
an example for sha256_hash_of_source_code_after_beautify = 00867e8f59188a3a6081f538a8acd9246b3250df7bf56cce211fa2cb27bdc610 is
```javascript
{
  "message": "Created function 00867e8f59188a3a6081f538a8acd9246b3250df7bf56cce211fa2cb27bdc610"
}
```

## Testing a function
Perform any http request to the endpoint http(s)://host/:sourceHash  
The req body from the server itself is passed onto the sanboxed function.  
For the above example we could do a GET to http(s)://host/00867e8f59188a3a6081f538a8acd9246b3250df7bf56cce211fa2cb27bdc610