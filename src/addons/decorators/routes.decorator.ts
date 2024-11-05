import { SetMetadata } from '@nestjs/common';
import { RouteMeta } from '../enums/routes.enum';

export const RouteMetaKey = 'RouteMeta';
export const SetRouteMeta = (meta: RouteMeta = RouteMeta.IS_PUBLIC) =>
  SetMetadata(RouteMetaKey, meta);
