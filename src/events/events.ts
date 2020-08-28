import { Subjects } from './subjects';

export interface Event<K> {
  subject: Subjects;
  data: K;
}
