
// name should equal to the service field with space or '_'
export const formValues = [
	{
		baseTag: 'input',
		type: 'text',
		name: 'currency details',
		class: '',
		id: 'currencyDetails',
		serviceField: '',
		value: '',
		placeholder: 'Currency Details',
	},
	{
		baseTag: 'input',
		type: 'radio',
		name: 'force mba update',
		class: '',
		id: 'mbaForceUpdate',
		serviceField: '',
		value: 'N',
		helpText: 'Select Yes option for model automatically asking Month Amount',
		options: [
		  {
		  	"lable": 'Yes',
		  	"value": 'Y',
		  	"status": 'checked',
		  },
		  {
		  	"lable": 'No',
		  	'value': 'N',
		  	"status": ''
		  }
		]
	},
	{
		baseTag: 'input',
		type: 'radio',
		name: 'active paytm',
		class: '',
		id: 'paytmActive',
		serviceField: '',
		value: 'N',
		helpText: 'Select Yes option active Paytm Excel uploading',
		options: [
		  {
		  	"lable": 'Yes',
		  	"value": 'Y',
		  	"status": '',
		  },
		  {
		  	"lable": 'No',
		  	'value': 'N',
		  	"status": 'checked',
		  }
		]
	}
]

// {
// 	baseTag: '',
// 	type: '',
// 	name: '',
// 	class: '',
// 	id: '',
// 	serviceField: '',
// 	value: '',
// 	placeholder: '',
//  helpText: ''
// }