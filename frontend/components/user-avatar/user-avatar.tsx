import { Avatar, AvatarProps } from '@chakra-ui/react';
import { resizeGooglePicture } from '@utils/image';
import { useMemo } from 'react';

interface ExtendedProps extends AvatarProps {
	lastName: string;
	givenName?: string | null;
	profile?: string | null;
}

type Props = Omit<Omit<ExtendedProps, 'src'>, 'name'>;

export function UserAvatar(props: Props) {
	const { lastName, givenName, profile, ...rest } = props;

	const picture = useMemo(() => profile && resizeGooglePicture(profile, 64), [profile]);

	const names = [lastName];
	if (givenName) {
		names.unshift(givenName);
	}

	return <Avatar src={picture ?? undefined} name={names.join(' ')} {...rest} />;
}
