export function isEmptyorNullUndefined(value: string){
    if (value === null || value === undefined || value.trim() === "") {
        return true
      }else {
        return false
      }
}