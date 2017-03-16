(function() {
  const prefix = '!6a07';
  let home = 1;
  let away = 1;

  return function() {
    away += 1;
    return {
      message: prefix + home + ' - ' + away
    };
  }
}());
