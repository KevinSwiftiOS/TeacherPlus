import {CommentEntity }from "../MyCourse/CommentsEntity";
import {AttachEntity }from "../MyCourse/AttachEntity";
import {VoteUpEntity }from "../MyCourse/VoteUpEntity";
export class ExperDetailsEntity {	
    id:any;	
    title:any;	
    isTop:any;	
    isGood:any;	
    viewtimes:any;	
    commentCount:any;	
    voteupCount:any;	
    author:any;		
    authorcomp:any;		
    avator	:any;		
    releaseTime	:any;	
    isMine:any;	
    content	:any;	
    attachs:[AttachEntity];
       
    voteups:[VoteUpEntity];
    comments:[CommentEntity]

};