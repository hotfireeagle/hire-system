export default async function({ data }) {
  const d = await data
  return (
    <h2 style={{ color: "blue" }}>{JSON.stringify(d)}</h2>
  )
}