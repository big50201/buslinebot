const TimeConvert = () => {
  const secTomin = (time) => {
    var min = Math.floor(time / 60);
    var sec = time % 60;

    return {
      min: min,
      sec: sec,
    };
  };

  const minTohour = (time) => {
    var hour = Math.floor(time / 60);
    var min = time % 60;

    return {
      hour: hour,
      min: min,
    };
  };

  const secTohour = (time) => {
    var sec = (time % 60) % 60;
    var min = Math.floor(time / 60) % 60;
    var hour = Math.floor(time / 3600);

    return {
      hour: hour,
      min: min,
      sec: sec,
    };
  };

  return { secTomin, minTohour, secTohour };
};

module.exports = TimeConvert;
