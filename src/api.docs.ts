/**
 *
 * API DOCS GUIDELINES
 * @ApiBearerAuth()
 * @ApiTags('Auth')
 * @ApiOperation({
 *  summary: 'Login', // Summary for the login endpoint
 * description: 'Endpoint to login users', // Description for the login endpoint
 * })
 * @ApiResponse({
 * status: 200, // only specified when we use the ApiResponse Generic operator
 *  description: 'User successfully logged in',
 *  type: UserDto, // specifies the type of data the user gets
 * isArray: true, // if the response is an array
 * })
 * @ApiBadRequestResponse({
 *  description: 'Invalid email or password',
 * type:validationDto
 * })
 * @ApiProperty({
 * description:"",
 * required:false,
 * }) to be used inside dto to describe the schema
 * @ApiPropertyOptional({
 * type:String;
 * type: [String],
 * type:enum,
 * example:"some example"
 * })
 *  use omitYpe from nestjs swagger
 */
