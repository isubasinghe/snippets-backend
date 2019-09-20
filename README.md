# What is this project

Its an insecure FaaS essentially, you can host your random snippets of code on here.  
Just make sure that it isnt security critical code.  
I have some security going on however, I have only allowed the http and net modules on here. Please let me know if other modules are required, I can write mock interfaces for fs if needed.

## Creating a function

Submit a POST request to http(s)://host/api/create that follows the JSON spec below

```javascript
{
    "source" "This is where a string representation of your source code should go"
}
```

This will return a json in this format
```javascript
{
  "message": "Created function {sha256_hash_of_source_code_after_beautify}"
}
```
an example for sha256_hash_of_source_code_after_beautify = 59f4a26ce99e3c41f0c721f7d49a547a0ce8a2455d50b2e0bdaf9f8a8750d071 is
```javascript
{
  "message": "Created function 59f4a26ce99e3c41f0c721f7d49a547a0ce8a2455d50b2e0bdaf9f8a8750d071"
}
```

## Testing a function
Perform any http request to the endpoint http(s)://host/:sourceHash  
The req body from the server itself is passed onto the sanboxed function.  
For the above example we could do a GET to http(s)://host/59f4a26ce99e3c41f0c721f7d49a547a0ce8a2455d50b2e0bdaf9f8a8750d071