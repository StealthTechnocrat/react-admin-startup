import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { adminService } from '../services';
import Admin from '../model/admin';
import { RootState } from '../../../store/store';
import { LoginFormData } from '../components/LoginForm';
import LoginDTO from '../dtos/loginDTO';
import { ChangePasswordFormType } from '../components/ChangePassword';

// import { LoginFormType } from '../../../pages/joins/Login';
// import { OTPFormType } from '../../../pages/joins/VerificationPage';
// import { ChangePasswordFormType } from '../components/PasswordChange';

type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface AdminState {
  admin: Admin | null;
  isAuthenticated: StatusType;
  fetchAccessTokenStatus: StatusType;
  fetchUserProfileStatus: StatusType;
  createUserStatus: StatusType;
  editUserStatus: StatusType;
  logoutStatus: StatusType;
  verifyEmailStatus: StatusType;
  changePasswordStatus: StatusType;
  generateOtp: StatusType;
  error: string | null;
}

const initialAdminState: AdminState = {
  admin: null,
  isAuthenticated: 'idle',
  fetchAccessTokenStatus: 'idle',
  fetchUserProfileStatus: 'idle',
  createUserStatus: 'idle',
  editUserStatus: 'idle',
  logoutStatus: 'idle',
  verifyEmailStatus: 'idle',
  changePasswordStatus: 'idle',
  generateOtp: 'idle',
  error: null,
};

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordFormType,
  { rejectValue: string }
>('admin/change-password', async (data: ChangePasswordFormType, thunkAPI) => {
  const result = await adminService.changePassword(
    data.oldPassword,
    data.password,
  );

  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  } else {
    return result.value.getValue();
  }
});

export const verifyEmail = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>('admin/verify-email', async (data: { token: string }, thunkAPI) => {
  const result = await adminService.verifiyEmail(data.token);

  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  } else {
    return result.value.getValue();
  }
});

export const login = createAsyncThunk<
  {},
  LoginFormData,
  { rejectValue: string }
>('admin/login', async (data: LoginFormData, thunkAPI) => {
  const result = await adminService.adminLogin(data);

  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  } else {
    return result.value.getValue();
  }
});

// export const generateOtp = createAsyncThunk<
//   void,
//   { email: string },
//   { rejectValue: string }
// >('admin/genrateOtp', async (data, thunkAPI) => {
//   const result = await userService.generateOtp(data.email);

//   if (result.isLeft()) {
//     const error: string = result.value;
//     return thunkAPI.rejectWithValue(error);
//   } else {
//     return result.value.getValue();
//   }
// });

// export const createAdmin = createAsyncThunk<
//   void,
//   { email: string; username: string; password: string },
//   { rejectValue: string }
// >('admin/createUser', async (data, thunkAPI) => {
//   //call backend api
//   const result = await adminService.createUser(
//     data.email,
//     data.username,
//     data.password,
//   );

//   if (result.isLeft()) {
//     const error: string = result.value;
//     return thunkAPI.rejectWithValue(error);
//   } else {
//     return result.value.getValue();
//   }
// });

export const getCurrentAdminProfile = createAsyncThunk<
  Admin,
  void,
  { state: RootState }
>('admin/getCurrentAdminProfile', async (req, thunkAPI) => {
  const result = await adminService.getCurrentAdminProfile();
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  } else {
    return result.value.getValue();
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'admin/logout',
  async (req, thunkAPI) => {
    const result = await adminService.logout();
    if (result.isLeft()) {
      const error: string = result.value;
      return thunkAPI.rejectWithValue(error);
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action: PayloadAction<void>) => {
        state.error = null;
        state.fetchAccessTokenStatus = 'loading';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.fetchAccessTokenStatus = 'failed';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginDTO>) => {
        state.fetchAccessTokenStatus = 'succeeded';
        state.error = null;
      })
      //   .addCase(createUser.pending, (state, action: PayloadAction<void>) => {
      //     state.error = null;
      //     state.createUserStatus = 'loading';
      //   })
      //   .addCase(createUser.rejected, (state, action) => {
      //     state.error = action.payload as string;
      //     state.createUserStatus = 'failed';
      //   })
      //   .addCase(createUser.fulfilled, (state, action) => {
      //     state.createUserStatus = 'succeeded';
      //     state.error = null;
      //   })
      .addCase(
        getCurrentAdminProfile.pending,
        (state, action: PayloadAction<void>) => {
          state.fetchUserProfileStatus = 'loading';
        },
      )
      .addCase(getCurrentAdminProfile.rejected, (state, action) => {
        state.fetchUserProfileStatus = 'failed';
        state.error = action.payload as string;
      })

      .addCase(
        getCurrentAdminProfile.fulfilled,
        (state, action: PayloadAction<Admin>) => {
          state.fetchUserProfileStatus = 'succeeded';
          state.admin = action.payload;
        },
      )
      .addCase(logout.pending, (state, action: PayloadAction<void>) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state, action: PayloadAction<void>) => {
        state.logoutStatus = 'succeeded';
        state.admin = null;
      })
      .addCase(verifyEmail.pending, (state, action: PayloadAction<void>) => {
        state.verifyEmailStatus = 'loading';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyEmailStatus = 'succeeded';
        state.error = null;
      });

    //   .addCase(changePassword.pending, (state, action: PayloadAction<void>) => {
    //     state.changePasswordStatus = 'loading';
    //   })
    //   .addCase(changePassword.rejected, (state, action) => {
    //     state.changePasswordStatus = 'failed';
    //     state.error = action.payload as string;
    //   })
    //   .addCase(changePassword.fulfilled, (state, action) => {
    //     state.changePasswordStatus = 'succeeded';
    //     state.error = null;
    //   });
  },
});

export const getUsersProfileStatus = (state: RootState) =>
  state.admin.fetchUserProfileStatus;

export const getVerifyEmailStatus = (state: RootState) =>
  state.admin.verifyEmailStatus;

export const getLogoutStatus = (state: RootState) => state.admin.logoutStatus;

export const getChangePasswordStatus = (state: RootState) =>
  state.admin.changePasswordStatus;

export const getGenerateOtpStatus = (state: RootState) =>
  state.admin.generateOtp;
export const getCurrentAdmin = (state: RootState) => state.admin.admin;
export const getAdminSliceError = (state: RootState) => state.admin.error;

export default adminSlice.reducer;
