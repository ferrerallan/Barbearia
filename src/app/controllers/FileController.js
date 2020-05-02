import File from '../models/File';

class FileController {
  async store(req, res) {
    console.log('original');
    const nome = req.file.originalname;
    const pathe = req.file.filename;
    const file = await File.create({
      name: nome,
      path: pathe,
    });

    return res.json(file);
  }
}

export default new FileController();
