import path from 'path';
import { ServerBuildType } from 'src/types';

export const generatePublicSpecification = () => (server: ServerBuildType) => {
  const { app } = server;

  const htmlFile = path.join(__dirname, 'index.html');

  app.get('/public/pomme', (req, res) => {
    return res.sendFile(htmlFile);
  });
};
