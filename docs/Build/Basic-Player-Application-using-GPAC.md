## Objective

This example shows a basic GPAC player application. It takes an URL as input and outputs it in a terminal.  

## Application 

Below is the code for the main application. Refer to attached file for full program.

```c
int main (int argc, char **argv)
{
	char c;		
	const char *str;
	u32 i;
	char *url_arg, *the_cfg;

	
	strcpy(the_url, ".");	// use current directory by default

	/** Initialisations 
	 *	- GF_User object
	 *	- url
	 *	- configuration file **/
	memset(&user, 0, sizeof(GF_User));
	url_arg = the_cfg = NULL;

	/** Load configuration file 
	 * 	- load a configuration file (.gpacrc) if exists,  else
	 *	- create a new configuration file (create_default_config) **/
	cfg_file = loadconfigfile(the_cfg);
	if (!cfg_file) {
		fprintf(stdout, "Error: Configuration File \"GPAC.cfg\" not found\n");
		return 1;
	}

	/** Fetch url from the command line **/
	url_arg = argv[1];	// url as input, it takes the second argument from the command line

	/** Modules manager
	 *	- gets the absolute path to the modules directory
	 *	- constructs a module manager object 
	 *	- loads modules **/

	fprintf(stdout, "Loading modules\n");
	str = gf_cfg_get_key(cfg_file, "General", "ModulesDirectory");

	user.modules = gf_modules_new((const unsigned char *) str, cfg_file);
	if (user.modules) i = gf_modules_get_count(user.modules);
	if (!i || !user.modules) {
		fprintf(stdout, "Error: no modules found in %s - exiting\n", str);
		if (user.modules) gf_modules_del(user.modules);
		gf_cfg_del(cfg_file);
		return 1;
	}

	fprintf(stdout, "Modules Loaded (%d found in %s)\n", i, str);

	/** Assignation values for GF_User object
	 *	- GF_Terminal takes GF_User as its parameter **/
	user.config = cfg_file;
	user.EventProc = GPAC_EventProc;
	user.opaque = user.modules; // dummy in this case (global variables) but must be no-null

	/** Load terminal
  	 *	- Creates a new terminal (new scene for the compositor, new download manager, net services)
	 * 	- load terminal  **/
	fprintf(stdout, "Loading GPAC Terminal\n");	
	term = gf_term_new(&user);
	if (!term) {
		fprintf(stdout, "\nInit error - check you have at least one video out and one rasterizer...\nFound modules:\n");
		list_modules(user.modules);
		gf_modules_del(user.modules);
		gf_cfg_del(cfg_file);
		gf_sys_close();
		return 1;
	}
	fprintf(stdout, "Terminal Loaded\n");

	/** Output driver verification - whether these entities exist for output
	 *	- Video
	 *	- Audio
	 *	- MIME file **/
	
	str = gf_cfg_get_key(cfg_file, "Video", "DriverName");
	if (!strcmp(str, "Raw Video Output")) fprintf(stdout, "WARNING: using raw output video (memory only) - no display used\n");
	
	str = gf_cfg_get_key(cfg_file, "Audio", "DriverName");
	if (!str || !strcmp(str, "No Audio Output Available")) fprintf(stdout, "WARNING: no audio output availble - make sure no other program is locking the sound card\n");

	str = gf_cfg_get_key(cfg_file, "General", "NoMIMETypeFetch");
	no_mime_check = (str && !stricmp(str, "yes")) ? 1 : 0;

	Run = 1;

	/** URL connection 
	 *	- terminal connects URL right away
	 *	- while URL is connected, stay connected until user type 'q' to quit **/
	char *ext;
	strcpy(the_url, url_arg);
	ext = strrchr(the_url, '.');
	fprintf(stdout, "Opening URL %s\n", the_url);
	gf_term_connect_from_time(term, the_url, 0, 0);
	
	while (Run) {  		
		if (!gf_prompt_has_input()) { 	// avoid getchar to block the application
			gf_sleep(rti_update_time_ms);
		}

		c = gf_prompt_get_char();
		if ( c == 'q' ) {
		  	Run = 0;
		}		
	}

	/** URL disconnection 
	 *	- disconnect the URL 
	 * 	- delete the application (close the main service, stop Media Manager, delete scene compositor)
	 *	- destroy Module Manager 
	 *	- destroy the configuration file or save if needed **/
	gf_term_disconnect(term);
	fprintf(stdout, "Deleting terminal... ");
	gf_term_del(term);
	fprintf(stdout, "OK\n");

	fprintf(stdout, "GPAC cleanup ...\n");
	gf_modules_del(user.modules);
	gf_cfg_del(cfg_file);

	fprintf(stdout, "Bye\n");

	return 0;
}
```


### File Include 

To create and use a terminal, `include/gpac/terminal.h` file needs to be included. It contains all terminal prototypes.  
If GPAC is installed on a LINUX distribution, the file `config.h`, present in the GPAC folder, is no more needed. Instead, the file gpac/configuration.h has to be included (like in WIN32 applications). 

### Variables

**`GF_User user`**: User object, contains user information needed by GF_Terminal for terminal creation (situated in `include/gpac/user.h`)  
**`GF_Terminal *term`**: Terminal object, contains various information including scene compositor, media manager, frame duration, net services.  
**`GF_Config *cfg_file`**: Configuration file object, contains information that can be found in the configuration file, as well as the file name and its path.  
**`Bool Run`**: a boolean to indicate the application's state.  
**`char the_url`**: url as input  
**`Bool no_mime_check`**: a boolean to indicate MIME type checking  

### Main application

1) Initialize various objects: user, url and configuration file.
2) Load the configuration file if exists. Else a new one is created (a call to `gf_cfg_new`, which takes the configuration filename and path as parameters. It returns a Configuration File object).
3) Fetch input (a url) from the command line (second argument).
4) Load Module Manager:  
   (a) Fetch the absolute path to modules directory  
   (b) Create a Module Manager object  
   (c) Load modules from the modules directory. If no modules is found, return error and terminate application.  
5) Assign value to user object for terminal creation
6) Load terminal; create a new terminal (a call to `gf_term_new` creates a scene for the compositor, Download Manager, as well as net services)
7) Verify output driver: check for video, audio and MIME type fetch
8) Connect URL:  
   (a) Terminal connects the URL right away upon calling  `gf_term_connect_from_time` (by specifying the start time to 0)  
   (b) While the URL is connected, it stays connected until user types '`q`' to quit the application  
9) Upon '`q`' reception from stdin, quitting application:  
   (a) Disconnect url  
   (b) Delete application (close main service, stop Media Manager, delete scene compositor)   
   (c) Destroy Module Manager  
   (d) Destroy configuration file or save it if needed  
10) End
