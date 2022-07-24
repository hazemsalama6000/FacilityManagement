import { IBlock } from "./IBlock.interface"
import { ITechnitianLog } from "./ITechnitianLog.interface"


export interface ICustomer {
	id: number,
	name: string,
	code: string,
	actualName: string,
	startIssue: Date,
	activityStartIssue: Date,
	actualActivity: string,
	blockId: number,
	areaId: number,
	blockName: string,
	areaName: string,
	statusId: number,
	numOfUnits: number,
	meterChassisNum: number,
	meterStartReading: number,
	meterStartDate: Date,
	meterStartIssue: Date,
	hasSewage: boolean,
	x: number,
	y: number,
	imagePath: string,
	isDataComplete: boolean,
}