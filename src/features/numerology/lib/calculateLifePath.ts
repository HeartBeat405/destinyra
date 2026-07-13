export function calculateLifePath(
    birthDate: string
  ) {
    // FORMAT:
    // YYYY-MM-DD
  
    const [year, month, day] =
      birthDate.split("-");
  
    // LIFE PATH CALCULATION
    const numbers = birthDate
      .replaceAll("-", "")
      .split("")
      .map(Number);
  
    let total = numbers.reduce(
      (acc, num) => acc + num,
      0
    );
  
    while (total > 9) {
      total = total
        .toString()
        .split("")
        .reduce(
          (acc, num) =>
            acc + Number(num),
          0
        );
    }
  
    // MASTER NUMBER
    let masterNumber = null;
  
    // CHECK DAY
    if (
      Number(day) === 11 ||
      Number(day) === 22 ||
      Number(day) === 33
    ) {
      masterNumber = Number(day);
    }
  
    // CHECK MONTH (only if the day didn't already yield a master number)
    if (
      masterNumber === null &&
      (Number(month) === 11 ||
        Number(month) === 22 ||
        Number(month) === 33)
    ) {
      masterNumber = Number(month);
    }
  
    return {
      lifePath: total,
      masterNumber,
    };
  }