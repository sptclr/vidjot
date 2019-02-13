if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://sptclr:Indonesia18@ds161062.mlab.com:61062/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}