
function renderScript({ cteName, selectList, sourceRef }) {
  return `
    ${cteName} as (
      select
      ${selectList}
      from ${sourceRef}
    )
    select * from ${cteName}
    `;
}


module.exports = {
    renderScript
}