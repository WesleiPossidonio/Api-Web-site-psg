import * as Yup from 'yup'
import Users from '../models/Users'
import { v4 } from 'uuid'

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password } = request.body

    const userExists = await Users.findOne({
      where: { email },
    })

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' })
    }

    const user = await Users.create({
      id: v4(),
      name,
      email,
      password,
    })

    return response.status(201).json({ id: user.id, name, email })
  }
}

export default new UserController()
