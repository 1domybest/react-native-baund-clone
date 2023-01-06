// const logOutRequest = createAsyncThunk('userLogOut', async (navigation, {dispatch, getState, rejectWithValue, fulfillWithValue}) => {
//     // try catch 는 하지말아야 에러를 캐치할수 있다.
//     // 상단 파라미터중 data는 요청시 들어온 파라미터이다. 저 파라미터를 가지고 서버에 데이터 요청하면된다.
//     const state = getState(); // 상태가져오기
//     let data = {
//         accessToken: null,
//         refreshToken: null,
//     }
//     await $Util.setStoreData("token", data)
//     return data;
// })
