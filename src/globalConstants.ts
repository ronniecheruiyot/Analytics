const env = "dev"
// const env = "test"
// const env = "prod"
const devUrl = "http://localhost:3000/api/";
const testUrl = '';
const prodUrl = '';
let url = ""
if(env === "dev"){
    url = devUrl
}else if(env === "prod"){
    url = prodUrl
}else {
    url = testUrl
}
// env === "dev" ? devUrl : env === "prod" ? prodUrl : testUrl


export const getpaymentReportUrl = url + "reports"
export const allDelegatesUrl = url + 'delegates?endpoint=getAllDelegates'
export const groupedDelegatesByMonthUrl = url + 'delegates?endpoint=getDelegatesByMonth'
export const allCompaniesUrl = url + 'companies?endpoint=getAllCompanies'
export const groupedCompanyCountBymonthUrl = url + 'companies?endpoint=getCompaniesBymonth'
export const allPaymentsUrl = url + 'payments?endpoint=getAllPayments'
export const groupedPaymentsCountByMonthUrl = url + 'payments?endpoint=getPaymentsBy'
export const getCompanyReportUrl = url + 'companies?endpoint=listCompaniesBetweenDates'
export const getDelegatesReportUrl = url + 'delegates?endpoint=listDelegatesBetweenDates'
