import { Box, Button, Stack, Typography } from "@mui/material";
import HomeNavBar from "./HomeNavBar";

const Home = () => {
    return (
        <Box>
            <HomeNavBar />
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                sx={{
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Lớp phủ với hiệu ứng làm mờ */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        // backgroundImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(13,13,94,1) 100%)",
                        // backgroundRepeat: 'no-repeat',
                        // backgroundPosition: 'center',
                        // backgroundSize: 'cover',
                        filter: 'blur(100px)', // Thay đổi giá trị để điều chỉnh độ mờ
                        zIndex: -1
                    }}
                />

                {/* Nội dung chính */}
                <Stack direction='column' alignItems='center' spacing={4}>
                    <Box display='flex' justifyContent='center'>
                        <Box width={500}>
                            <Typography variant='h3' fontWeight={650} textAlign='center'>
                                Simplify Complexity
                            </Typography>
                            <Typography variant='h3' fontWeight={650} textAlign='center'>
                                Amplify Success
                            </Typography>
                            <Typography variant='h6' textAlign='center' mt={2}>
                                Easily manage your projects and achieve success. Streamline your tasks with our simple, effective tool.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant='contained'
                        size="large"
                        sx={{
                            width: 400,
                            backgroundColor: 'white !important',
                            color: 'black'
                        }}
                    >
                        GET STARTED
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Home;
