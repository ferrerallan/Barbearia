import * as Yup from 'yup';
import {
  startOfHour, parseISO, isBefore, format, subHours
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true
      }
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'não é um provider' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ msg: 'data nao pode ser antes de hoje' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(401).json({ msg: 'horario nao esta vago' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    /*
    * Notificar o provider
    */
    const user = await User.findByPk(req.userId);

    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às ' H:mm'h'",
      { locale: pt }
    );

    try {
      await Notification.create({
        content: `Novo agendamento de ${user.name} para ${formatedDate}`,
        user: provider_id,
      });
    } catch (err) {
      console.log(err);
    }

    return res.json(appointment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ]
        },
      ]
    });

    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Sem permissao de acesso pra cancelar agendamento de outro usuario'
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (!isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: `ja passou do horario maximo de cancelamento(2 horas)${dateWithSub}`
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Mail.sendMail({
      to: '\'Allan\' \'<ferrerallan@gmail.com>\'',
      subject: 'Agendamento cancelado',
      text: 'voce tem um novo cancelamento',
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
