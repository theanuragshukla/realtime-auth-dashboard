import { EVENT_CHANNEL, MAIL_SUBJECTS, MAIL_TEMPLATES } from "../constants";
import { ActivityEntity } from "../databases/postgres/entity/activity.entity";
import Redis from "../databases/redis/connection";
import Mailer from "../mailer/mailer";
import { CreateMail } from "../utils/types";
const redis = Redis.newClient();
const pub = Redis.getInstance();

const eventConsumer = async (io: any) => {
  await redis.subscribe(EVENT_CHANNEL, (key: string) => {
    pub
      .lPop(key)
      .then((msg) => {
        if (!msg) return;
        if (key.startsWith("mail")) {
          const data = JSON.parse(msg) as CreateMail;
          Mailer.sendMail(
            data.to,
            MAIL_SUBJECTS(data.action),
            MAIL_TEMPLATES(data.action, data.user)
          );
          return;
        }
        const data = JSON.parse(msg) as ActivityEntity;
        io.to(["admin", data.uid]).emit("event", {
          uid: data.uid,
          seed: data.seed,
          action: data.action,
          timestamp: data.timestamp,
        });
      })
      .catch(console.error);
  });
};

export default eventConsumer;
