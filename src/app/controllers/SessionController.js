import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import Users from '../models/Users'
import authCondig from '../../config/auth'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const dataUserIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'your password or your email is incorrect' })
    }

    if (!(await schema.isValid(request.body))) {
      return dataUserIncorrect()
    }
    const { email, password } = request.body

    const user = await Users.findOne({
      where: { email },
    })

    if (!user) {
      return dataUserIncorrect()
    }
    if (!(await user.checkPassword(password))) {
      return dataUserIncorrect()
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      token: jwt.sign({ id: user.id }, authCondig.secret, {
        expiresIn: authCondig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
