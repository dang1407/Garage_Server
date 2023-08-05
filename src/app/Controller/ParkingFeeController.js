const asyncHandler = require("express-async-handler");
const User = require("../../models/user.model");
const ParkingFee = require("../../models/parkingFee.model");

const daytimeEmployee = {
  bicycle: 2000,
  motor: 3000,
  car: 3000,
};

const nighttimeEmployee = {
  bicycle: 3000,
  motor: 5000,
};

const overdayParkingEmployee = {
  bicycle: 10000,
  motor: 20000,
};

const daytimeHauntCustomer = {
  motor: 5000,
  car: 5000,
};

const nighttimeHauntCustomer = {
  motor: 8000,
};

const overdayParkingHauntCustomer = {
  motor: 30000,
};

const parkingIn = asyncHandler(async (req, res) => {
  const { licensePlates, vehicle } = req.body;
  if(!licensePlates || !vehicle) throw new Error("Missing Input!!")
  const timein = new Date();
  const parkedIn =  await ParkingFee.find({licensePlates});
  if(parkedIn.status === "Xe chưa ra khỏi bãi!!"){
    return res.status(200).json({
      success: false,
      mes: "Xe chưa rời khỏi bến! Vui lòng kiểm tra lại!"
    })
  }
  const employee = await User.findOne({ licensePlates });
  // if(employee)
  let typeCustomer;
  if (employee) {
    typeCustomer = "Nhân viên công ty";
  } else {
    typeCustomer = "Khách vãng lai";
  }
  const dayin = timein.getDate();
  const respone = await ParkingFee.create({
    timein,
    licensePlates,
    vehicle,
    typeCustomer,
    dayin
  });
  return res.status(200).json({
    success: true,
    mes: "Xe đã vào bến!!",
  });
});

const parkingFeeCalculate = asyncHandler(async (req, res) => {
  let { licensePlates, timeout, vehicle } = req.body;
  console.log(req.body);
  if (!licensePlates || !timeout || !vehicle) throw new Error("Missing inputs");
  const user = await ParkingFee.findOne({ licensePlates });
  if (user) {
    if(user.status === "Xe đã rời khỏi bãi đỗ"){
      return res.status(200).json({
        success: false,
        mes: "Xe đã rời bến! Vui lòng kiểm tra lại!"
      })
    }
    const datetimein = new Date(user.timein);
    const datetimeout = new Date(timeout);
    const datein = datetimein.getDate();
    const dateout = datetimeout.getDate();
    const numHours = (datetimeout - datetimein) / (60 * 60 * 1000);
    // let numDay = 0;
    let typeCustomer = user.typeCustomer;
    let typeTime = "";
    let result = 0;
    if (datetimeout <= datetimein) throw new Error("Wrong inputs!");
    if (vehicle !== user.vehicle) {
      return res.status(200).json({
        success: true,
        price: 0,
        mes: "Biến số xe có thể giả",
      });
    }
    if (datein === dateout) {
      const specifixedTime = new Date(timein);
      specifixedTime.setHours(18);
      specifixedTime.setMinutes(30);
      specifixedTime.setSeconds(0);
      specifixedTime.setMilliseconds(0);
      if (datetimeout > specifixedTime) {
        typeTime = "Trong ngày qua 18h30";
      } else {
        typeTime = "Trong ngày trước 18h30";
      }
    } else if (dateout > datein) {
      typeTime = "Qua ngày";
      numDay = Math.ceil(numHours / 24);
    }

    if (vehicle === "Xe máy") {
      if (typeCustomer === "Khách vãng lai") {
        if (typeTime === "Trong ngày qua 18h30") {
          result = nighttimeHauntCustomer.motor;
        } else if (typeTime === "Trong ngày trước 18h30") {
          result = daytimeHauntCustomer.motor;
        } else if (typeTime === "Qua ngày") {
          result = (dateout - datein) * overdayParkingHauntCustomer.motor;
        }
      } else {
        if (typeTime === "Trong ngày qua 18h30") {
          result = nighttimeEmployee.motor;
        } else if (typeTime === "Trong ngày trước 18h30") {
          result = daytimeEmployee.motor;
        } else if (typeTime === "Qua ngày") {
          result = (dateout - datein) * overdayParkingEmployee.motor;
        }
      }
    } else if (vehicle === "Xe đạp") {
      typeCustomer = "Khách đi xe đạp";
      if (typeTime === "Trong ngày qua 18h30") {
        result = nighttimeEmployee.bicycle;
      } else if (typeTime === "Trong ngày trước 18h30") {
        result = daytimeEmployee.bicycle;
      } else if (typeTime === "Qua ngày") {
        result = (dateout - datein) * overdayParkingEmployee.bicycle;
      }
    } else if (vehicle === "Ô tô") {
      if (typeCustomer === "Khách vãng lai") {
        result = numHours * daytimeHauntCustomer.car;
      } else {
        result = numHours * daytimeEmployee.car;
      }
    }
    if (typeTime === "Qua ngày") {
      typeTime = `Qua ${dateout - datein} ngày`;
    }
    let status =  "Xe đã rời khỏi bãi đỗ";
    const parkedOut = await ParkingFee.findOneAndUpdate({licensePlates}, {timeout, typeTime, price: result, status}) 
    //   console.log(numHours, typeCustomer, typeTime);
    if(parkedOut){
      return res.status(200).json({
        success: true,
        price: result,
        typeTime,
        vehicle,
        typeCustomer,
        licensePlates,
      });
    } else {
      return res.status(200).json({
        success: false,
        mes: "Có lỗi xảy ra"
      })
    }
    
  } else {
    return res.status(200).json({
      success: false,
      mes: "Xe chưa vào bến!!",
    });
  }
});

module.exports = {
  parkingFeeCalculate,
  parkingIn,
};
