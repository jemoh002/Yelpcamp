const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.Vel iusto porro, sed dolores corporis quibusdam cumque labore vitae voluptate ullam animi aliquam doloremque alias totam deleniti, odit qui soluta in',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dzent5jjy/image/upload/v1691310555/YelpCamp/vrte1uxyg0nov3bzur2y.jpg',
                    filename: 'YelpCamp/vrte1uxyg0nov3bzur2y'
                },
                {
                    url: 'https://res.cloudinary.com/dzent5jjy/image/upload/v1691310550/YelpCamp/ninxcih9i8awgtmjheet.jpg',
                    filename: 'YelpCamp/ninxcih9i8awgtmjheet'
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})