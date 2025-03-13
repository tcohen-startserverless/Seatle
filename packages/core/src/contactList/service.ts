import { ContactList } from './entity';
import { ContactListSchemas } from './schema';

export namespace ContactListService {
  export const create = async (input: ContactListSchemas.Types.CreateInput) => {
    const res = await ContactList.create(input).go();
    return res.data;
  };

  export const get = async (input: ContactListSchemas.Types.GetInput) => {
    const res = await ContactList.get(input).go();
    return res.data;
  };

  export const list = async (input: ContactListSchemas.Types.ListInput) => {
    const { cursor, ...key } = input;
    const res = await ContactList.query.primary(key).go({
      cursor,
    });
    return res;
  };

  export const listByStatus = async (input: ContactListSchemas.Types.ListByStatusInput) => {
    const { cursor, ...key } = input;
    const res = await ContactList.query.byStatus(key).go({
      cursor,
    });
    return res;
  };

  export const patch = async (
    params: ContactListSchemas.Types.GetInput,
    input: ContactListSchemas.Types.PatchInput
  ) => {
    const res = await ContactList.patch(params).set({
      ...input,
      updatedAt: Date.now(),
    }).go();
    return res.data;
  };

  export const addPerson = async (
    params: ContactListSchemas.Types.GetInput,
    personId: string
  ) => {
    const res = await ContactList.get(params).go();
    const contactList = res.data;
    
    if (!contactList) {
      throw new Error('Contact list not found');
    }
    
    const personIds = contactList.personIds || [];
    if (!personIds.includes(personId)) {
      const updatedRes = await ContactList.patch(params).set({
        personIds: [...personIds, personId],
        updatedAt: Date.now(),
      }).go();
      return updatedRes.data;
    }
    
    return contactList;
  };

  export const removePerson = async (
    params: ContactListSchemas.Types.GetInput,
    personId: string
  ) => {
    const res = await ContactList.get(params).go();
    const contactList = res.data;
    
    if (!contactList) {
      throw new Error('Contact list not found');
    }
    
    const personIds = contactList.personIds || [];
    if (personIds.includes(personId)) {
      const updatedRes = await ContactList.patch(params).set({
        personIds: personIds.filter(id => id !== personId),
        updatedAt: Date.now(),
      }).go();
      return updatedRes.data;
    }
    
    return contactList;
  };

  export const remove = async (input: ContactListSchemas.Types.DeleteInput) => {
    const res = await ContactList.remove(input).go();
    return res.data;
  };
}