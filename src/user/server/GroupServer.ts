import { ICommonProps } from "../common";
import { ICommonPropsHandlerCollection } from "./CommonPropsHandlerServer";

interface IGroupService extends ICommonProps { }

export class GroupService implements IGroupService {
  constructor(
    @ICommonPropsHandlerCollection
    private commonPropsHandlerCollection: ICommonPropsHandlerCollection
  ) { }
}