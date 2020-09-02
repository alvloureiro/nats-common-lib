import { Subjects } from './subjects';

export interface Event<K> {
  subject: Subjects['type'];
  data: K;
}
