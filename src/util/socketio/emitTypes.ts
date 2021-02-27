import {User} from '../../models/user';
import {RoomId} from '../../models/room';
import {Panel} from '../../game';

// Client To Server
export type C2SEmitTypes = MatchingStartEmit | JoinRoomEmit;
export type MatchingStartEmit = {
  key: 'MatchingStart';
  value: {
    user: User;
  };
};
export type JoinRoomEmit = {
  key: 'JoinRoom';
  value: {
    roomId: RoomId;
    user: User;
  };
};

export type UpdatePanelEmit = {
  key: 'UpdatePanel';
  value: {
    roomId: RoomId;
    user: User;
    panel: Panel;
  };
};

// Server to Client
export type S2CEmitTypes = FoundOtherUser | MatchedGame | UpdateOtherPanel;
export type FoundOtherUser = {
  key: 'FoundOtherUser';
  value: {
    otherUser: User;
    roomId: RoomId;
  };
};

export type MatchedGame = {
  key: 'MatchedGame';
  value: {
    otherUser: User;
    roomId: RoomId;
  };
};

export type UpdateOtherPanel = {
  key: 'UpdateOtherPanel';
  value: {
    otherUserPanel: Panel;
  };
};
