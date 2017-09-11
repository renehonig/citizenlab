import { IIdeaImage } from './ideaImages';
import { API_PATH } from 'containers/App/constants';
import streams, { IStreamParams } from 'utils/streams';
import request from 'utils/request';

export interface IIdeaImageData {
  id: string;
  type: string;
  attributes: {
    versions: {
      small: string;
      medium: string;
      large: string;
    };
    ordering: number;
    created_at: string;
    updated_at: string;
  };
}

export interface IIdeaImage {
  data: IIdeaImageData;
}

export interface IIdeaImages {
  data: IIdeaImageData[];
}

export function ideaImageStream(ideaId: string, imageId: string, streamParams: IStreamParams<IIdeaImage> | null = null) {
  const apiEndpoint = `${API_PATH}/ideas/${ideaId}/images/${imageId}`;
  return streams.get<IIdeaImage>({ apiEndpoint, ...streamParams });
}

export function ideaImagesStream(ideaId: string, streamParams: IStreamParams<IIdeaImages> | null = null) {
  const apiEndpoint = `${API_PATH}/ideas/${ideaId}/images`;
  return streams.get<IIdeaImages>({ apiEndpoint, ...streamParams });
}

export function addIdeaImage(ideaId: string, base64: string, ordering: number | null = null) {
  const apiEndpoint = `${API_PATH}/ideas/${ideaId}/images`;
  const bodyData = {
    image: {
      ordering,
      image: base64,
    }
  };

  return streams.add<IIdeaImage>(apiEndpoint, bodyData);
}
