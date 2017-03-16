(function() {
  const prefix = '!6a09';
  let begin = 3628;

  return function() {
    begin += 1;
    return {
      message: prefix + begin
    };
  }
}());
