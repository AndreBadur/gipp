const handler = () => {
  return new Response(
    JSON.stringify({
      message: 'Escopo de mensagem Response',
    }),
    { status: 200 }
  )
}
export { handler as GET, handler as POST }
