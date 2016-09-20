# ConditionJobApp

Submit ReseqCondition jobs to SMRT Link Internal Analysis

## Build

```
npm install
bower install
make compile # builds bundle.js
```


## Run
    
```
make static-server # static server for html/js/css on localhost at 8080
```

See `makefile` for more details.

## Todo

- Add client side validation of CSV
- Add better error handling when pipelines are accessible
- Add more informative message when POST fails
- split out client calls into their own class