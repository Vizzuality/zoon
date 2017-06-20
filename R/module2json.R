module2json <- function(module_text){
  library(roxygen2, quietly=TRUE)
  library(jsonlite, quietly=TRUE)

  x <- roxygen2:::parse_text(module_text)[[2]]
  if(is.null(x)){
    x <- list()
  }
  if(length(x) == 1){
    x <- list(x)
  }
  y <- sapply(x, function(o){
      o$object = NULL
      o$srcref = NULL
      if(!is.null(o$examples)){ o$examples = toString(o$examples) }
      return(o)
  })
  return(jsonlite::toJSON(y, pretty = TRUE, auto_unbox = TRUE))
}

con <- file("stdin")
file_contents <- readLines(con)
result = try(module2json(file_contents), silent=TRUE)
if(class(result) == "try-error"){
  result = "[]"
}
cat(paste(result, "\n"))
