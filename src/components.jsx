

//=================================
// LAYOUTS
//=================================


export function Layout(props) {
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel='stylesheet' href='/static/css/output.css' />
                <script src="/static/js/htpl.js"></script>
                <title>{props.title}</title>
            </head>
            <body className='relative h-[100vh] select-none'>
                {props.children}
            </body>
        </html>
    )
}

//=================================
// VIEWS
//=================================

export function Home(props) {
    return (
        <Layout title="Login - Receipts">
            <Header hasIcons={false} />
            <LoginForm err={props.err} />
        </Layout>
    )
}

export function AppHome(props) {
    return (
        <Layout title="App - Receipts">
            <Header hasIcons={true}  />
            <NavMenu />
            <Overlay id='nav-overlay' hidden={true} />
            <UploadReceiptForm />
            <div id='photo-container' className='flex flex-wrap flex-start p-4 w-full overflow-hidden gap-4 items-start'></div>
        </Layout>
    )
}

export function AppNewReceipts(props) {
    return (
        <Layout title="App - Receipts">
            <Header hasIcons={true}  />
            <NavMenu />
            <Overlay id='nav-overlay' hidden={true} />
            {props.receipts.map((item, index) => {
                return (
                    <div className='flex flex-col p-2' key={index}>
                        <p>{item.name}</p>
						<p>{item.reason}</p>
						{item.photos.map((photo, index2) => {
							return (
								<div key={index2}>
									<p>{photo.id}</p>
									<img src={photo.path} />
								</div>
							)
						})}
                    </div>
                )

            })}
        </Layout> 
    )
}

//=================================
// REUSED HTPL EVENTS
//=================================

const TOGGLE_NAV_MENU = `click:#header-bars #header-x #nav-menu #nav-overlay:hidden`

//=================================
// COMPONENTS
//=================================

export function Header(props) {

    return (
        <header id='header' className='flex flex-row justify-between border-b z-50 relative bg-white'>
            <div className='flex flex-col p-4'>
                <h1 className='text-xl font-bold'>Receipt Tracker</h1>
                <p className='text-sm'>Where's my money?</p>
            </div>
            {props.hasIcons ?
                <>
                    <div id='header-bars' className='p-4 flex items-center cursor-pointer' _mass-toggle={TOGGLE_NAV_MENU}>
                        <IconBars />
                    </div>
                    <div id='header-x' className='p-4 flex items-center hidden cursor-pointer' _mass-toggle={TOGGLE_NAV_MENU}>
                        <IconX />
                    </div>
                </>
            :
                <></>
            }
        </header>
    )
}

export function FormInput(props) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-sm'>{props.label}</label>
            {props.inputType == 'textarea' ?
                <textarea rows={props.rows} name={props.name} className='border rounded text-sm p-1 outline-none border-gray-200 focus:border-gray-400' />
            :
                <input name={props.name} type={props.inputType}  className='border rounded text-sm p-1 outline-none border-gray-200 focus:border-gray-400' />        
            }
        </div>
    )
}

export function LoginForm(props) {
    return (
        <form className='flex flex-col gap-12 p-4' action="/form/login" method='POST' >
            <div className='flex flex-col gap-4'>
                <h2 className='font-bold text-xl'>Login</h2>
                <p className='text-sm text-red-500'>{props.err}</p>
            </div>
            <FormInput label="Username" inputType="text" name="username" />
            <FormInput label="Password" inputType="password" name="password" />
            <input type='submit' className='bg-black text-white p-2 rounded text-sm cursor-pointer' value='Submit' />
        </form>
    )
}

export function UploadReceiptForm(props) {
    return (
        <form className='flex flex-col gap-12 p-4' action="/form/receipt" method='POST' _multi-photo-form='#hidden-upload-button:#photo-container:#undo-icon:200:flex' encType="multipart/form-data" >
            <div className='flex flex-col gap-4'>
                <h2 className='font-bold text-xl'>Upload Receipts</h2>
                <p className='text-sm text-red-500'>{props.err}</p>
            </div>
            <FormInput label="Name" inputType="text" name="name" />
            <FormInput label="Reason" inputType="textarea" name="reason" rows="4" />
            <div className='flex flex-row justify-between'>
                <button type='button' className='bg-blue-700 text-white rounded px-4 py-1 w-fit text-sm' _click-proxy='#hidden-upload-button'>Upload</button>
                <div id='undo-icon' className='pr-4'>
                    <IconUndo />
                </div>
            </div>
            <input type='file' name='files' className='hidden' id='hidden-upload-button' />
            <input type='submit' className='bg-black text-white p-2 rounded text-sm cursor-pointer' value='Submit' />
        </form>
    )
}

export function IconBars(props) {
    return (
        <div className='flex'>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
        </div>
    )
}

export function IconX(props) {
    return (
        <div className='flex'>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </div>
    );
}

export function IconUndo(props) {
    return (
        <div className='flex'>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
            </svg>
        </div>
    );
}


export function NavMenu(props) {
    return (
        <nav id='nav-menu' className='absolute top-0 w-3/4 hidden z-40 bg-white'>
            <ul className='p-2 flex flex-col gap-2 border-r h-[100vh]'>
                <div id='nav-buffer' _match-height='#header'></div>
                <NavLink text='Upload Receipts' href={`/app?token=${Bun.env.URL_SECRET_TOKEN}`} />
                <NavLink text='New Receipts' href='/app/receipts' />
                <NavLink text='Logout' href="/logout" />
            </ul>
        </nav>
    )
}

export function NavLink(props) {
    return (
        <li className='rounded border flex text-sm'>
            <a className='p-4 w-full' _active-link="bg-gray-200" href={props.href}>{props.text}</a>
        </li>
    )
}

export function Overlay(props) {
    return (
        <>
            {props.hidden ?
                <div id='nav-overlay' className='top-0 absolute z-30 h-full w-full bg-black opacity-50 hidden' _mass-toggle={TOGGLE_NAV_MENU}></div>
            :
                <div id='nav-overlay' className='top-0 absolute z-30 h-full w-full bg-black opacity-50' _mass-toggle={TOGGLE_NAV_MENU}></div>
            }
        </>
    )
}
