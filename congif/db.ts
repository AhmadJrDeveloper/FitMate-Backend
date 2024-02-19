import mongoose from 'mongoose';

const connect = async (db_string: string) => {
    try {
        await mongoose.connect(db_string);
        console.log('DB Connected');
    } catch (err) {
        console.log("Can't connect to DB", err);
    }
};

export default connect;
