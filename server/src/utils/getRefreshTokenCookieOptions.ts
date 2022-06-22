import { ENV } from '@mandruy/common/const';
import { ConfigService } from '@nestjs/config';

export function getRefreshTokenCookieOptions() {
  //   const refreshExpiresIn = this.configService.get(
  //     ENV.JWT_REFRESH_EXPIRATION_TIME,
  //   );
  const refreshExpiresIn = new ConfigService().get(
    ENV.JWT_REFRESH_EXPIRATION_TIME,
  );
  const maxAge = parseInt(refreshExpiresIn, 10) * 24 * 60 * 60 * 1000;
  return {
    maxAge,
    httpOnly: true,
    // secure: true, // for https
  };
}
