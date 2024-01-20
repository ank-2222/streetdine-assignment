

export type IEmployeeReqObj = {
	employee_id: string;
	first_name: string;
	last_Name: string;
	email: string;
	dob: string; 
	department: string;
	position: string;
};


export type IEmployeeResObj = {
	id:string;
	employee_id: string;
	first_name: string;
	last_Name: string;
	email: string;
	dob: string; 
	department: string;
	position: string;
	createdAt: Date;
}

export type IAuthResponse = {
	user: IResponse; //error
	token?: string;
};