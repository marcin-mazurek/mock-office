(function() {
  const prefix = '';
  let begin = 1489626242497;
  const postfix = '';

  return function () {
    begin += 1;
    return {
      message: prefix + begin + postfix
    };
  }
}());