const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); 
router.db._.id = "BeverageId";
server.use(router); 