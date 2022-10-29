// const mongoose = require('mongoose');
const { DB_URL } = require('../config');
import mongoose from "mongoose";


// console.log(DB_URL, 'OKOLIOKOLIKOLIKOLKOPPPPPPPPPPPPPPPPPPP');

// console.log(process.env, 'kkk');



module.exports = async() => {

    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.error('Error ============ ON DB Connection')
        console.log(error);
    }
 
};

 
