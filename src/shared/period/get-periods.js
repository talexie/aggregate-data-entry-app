export const convertNavigatorYear =(year,calendar='ethiopic')=>{
    const navYear = new Date(`${year}-01-01`);
    let result = navYear?.toLocaleString('en',{
        calendar: calendar,
        year: 'numeric'
    });
    result = result?.replace(/ERA\d+\s*/g, '')?.trim()
    return result;
}
export const convertGregoryToOther =(periods,periodType,calendar='ethiopic')=>{
    if(calendar ==='ethiopian' || calendar=='ethiopic'){
        return periods?.map((period)=>{
            const d = new Date(period?.startDate);
            let result = `${d.toLocaleString('en',{
                calendar: calendar,
                month: 'long'
              })} - ${
                d.toLocaleString('en',{
                  calendar: calendar,
                  year: 'numeric'
                })}`;
            result = result.replace(/ERA\d+\s*/g, '').trim()
            if(periodType ==='MONTHLY'){
                return ({
                    ...period,
                    name: result,
                    isoname: period?.name
                })
            }
            return ({
                ...period,
                name: period?.name,
                isoname: period?.name
            })
            
        })
    }
    return periods;

}
