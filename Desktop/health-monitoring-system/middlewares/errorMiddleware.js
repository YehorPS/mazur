// middlewares/errorMiddleware.js

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Щось пішло не так. Спробуйте пізніше.' });
  };
  