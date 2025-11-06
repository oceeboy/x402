import { x402PaymentMiddleware } from '../middleware/x402.middleware';
import { UserController } from '../controllers/user.controller';
import { Router } from 'express';

const router: Router = Router();
const userController = new UserController();

router.get('/allUsers', x402PaymentMiddleware(1), userController.getAllUsers);
router.post('/create', x402PaymentMiddleware(1), userController.createUser);
// by id
router.get('/:id', x402PaymentMiddleware(1), userController.getUserById);
router.put('/update/:id', x402PaymentMiddleware(1), userController.updateUser);
router.delete(
  '/delete/:id',
  x402PaymentMiddleware(1),
  userController.deleteUser,
);

export default router;
