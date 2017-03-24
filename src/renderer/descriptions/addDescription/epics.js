import { Observable } from 'rxjs';
import { remote } from 'electron';
import { INIT, add } from './actions';

const addDescriptionEpic = action$ =>
  action$.ofType(INIT)
    .flatMap((action) => {
      const { serverId, descriptions } = action;
      const descriptionsForAdd = descriptions.map((description) => {
        const server = remote.require('./main/servers').default.find(serverId);
        const descriptionId = server.addDescription(description);

        return [
          serverId,
          descriptionId,
          description.descriptionPayload,
          description.title,
          description.interval,
          description.reuse,
          description.quantity,
          description.delay,
          description.requirements,
          description.blocking
        ];
      });

      return Observable.from(descriptionsForAdd);
    }).map(description => add(...description));

export default addDescriptionEpic;
