export default defineEventHandler(async (event) => {
  const randomId = Math.floor(Math.random() * 1200) + 1;
  
  const sentence = {
    id: randomId.toString(),
    english: 'this is a test sentence',
    chinese: '这是一个测试句子',
    explanation: '这是一个测试句子的解释',
    mp3: `http://media.ihuhao.com/nce2-sentences/${randomId}.mp3`
  }

  return sentence
})
