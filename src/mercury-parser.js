import Mercury from '@postlight/mercury-parser';

import { corsSuccessResponse, corsErrorResponse, runWarm } from './utils';

const mercuryParser = async (event, context, cb) => {
  let newEvent = event;
  let { queryStringParameters: queryParameters } = newEvent;
  if (!queryParameters) {
    newEvent = JSON.parse(event);
    ({ queryParameters } = newEvent);
  }

  if (!queryParameters) {
    return cb(
      null,
      corsErrorResponse({
        message: `There must be a queryStringParameters: ${newEvent}`,
      })
    );
  }

  let { url } = queryParameters;
  url = unescape(url);

  if (!url) {
    return cb(
      null,
      corsErrorResponse({
        message: `There must be a url for query parameter: ${newEvent}`,
      })
    );
  }

  const result = await Mercury.parse(url);

  return cb(
    null,
    result
      ? corsSuccessResponse(result)
      : corsErrorResponse({ message: 'There was an error parsing that URL.' })
  );
};

export default runWarm(mercuryParser);
